// Importe a biblioteca do Selenium WebDriver para JavaScript
import { Builder, By, Key, until } from 'selenium-webdriver';

// Função async para poder usar comandos await
async function consultarConsoleVendaId() {
  // Crie um novo driver para o navegador (Chrome, nesse caso)
  let driver = await new Builder().forBrowser('firefox').build();

  try {

    await driver.get("http://localhost:3000")
    await driver.sleep(2000);
    await driver.findElement(By.id("cargoUser")).click()
    await driver.sleep(1000);
    await driver.findElement(By.id("inputUser")).sendKeys("joao.silva")
    await driver.sleep(1000);
    await driver.findElement(By.id("inputPassword")).sendKeys("senha123")
    await driver.sleep(1000);
    await driver.findElement(By.css(".button-container > .btn")).click()
    await driver.sleep(2000);
    await driver.findElement(By.linkText("Gerenciar Consoles")).click()
    await driver.sleep(1000);
    await driver.findElement(By.id("idConsole")).sendKeys("-5")
    await driver.sleep(1000);
    await driver.findElement(By.id("button-addon2")).click()
    await driver.sleep(3000);

    // Feche o navegador
    await driver.quit();
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
}

// Chame a função para fazer a consulta usando o Selenium
consultarConsoleVendaId();