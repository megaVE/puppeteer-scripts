import { config } from "dotenv"
import { configureCleanUp } from "./lib/cleanUp.js"
import { createBrowserAndPage } from "./lib/puppeteer.js"

config()

const USER_DATA = { "usuario": process.env.USUARIO, "senha": process.env.SENHA }

const daysToIndex = { "seg": 0, "ter": 1, "qua": 2, "qui": 3, "sex": 4}

export async function runReserver({
  daysToReserve = ["seg", "ter", "qua", "qui", "sex"],
  isVeggie = false
} = {}) {
  const daysIndexes = daysToReserve.map(day => daysToIndex[day])

  const { browser, page } = await createBrowserAndPage("https://sistemas.unifal-mg.edu.br/app/restauranteuniversitario/reservas/")

  // Autenticação
  const usuarioSelector = 'input[name="login"]'
  await page.waitForSelector(usuarioSelector)
  await page.type(usuarioSelector, USER_DATA.usuario)
  
  const senhaSelector = 'input[name="password"]'
  await page.waitForSelector(senhaSelector)
  await page.type(senhaSelector, USER_DATA.senha)

  await page.keyboard.press('Enter')

  // Reserva
  const tableSlotsSelector = 'tbody tr td center'

  await page.waitForSelector(tableSlotsSelector)
  await page.evaluate(({ isVeggie, daysIndexes, tableSlotsSelector }) => {
    // Seleção da linha de Almoço
    const tableSlots = document.querySelectorAll(tableSlotsSelector)
    const lunchRow = Array.from(tableSlots).find(slot => slot.textContent === "Almoço")
      .parentNode.parentNode

    // Marcação das checkboxes desejadas
    const lunchRowAllCheckboxes = lunchRow.querySelectorAll('input[type="checkbox"]')
    Array.from(lunchRowAllCheckboxes)
      .filter((_, index) => (isVeggie ? index + 1 % 2 == 0 : index % 2 == 0)) // Vegano ou não
      .filter((_, index) => daysIndexes.includes(index)) // Dias selecionados
      .forEach(checkbox => {
        checkbox.removeAttribute('disabled')
        checkbox.checked = true
    })
  }, { isVeggie, daysIndexes, tableSlotsSelector })

  // Confirmação
  const submitSelector = 'input[name="salvar"]'
  await page.waitForSelector(submitSelector)
  await page.click(submitSelector)
  console.log("Reserva concluída com sucesso!")

  configureCleanUp(async () => await browser.close())
}
