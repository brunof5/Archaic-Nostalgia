// Importe a biblioteca do Selenium WebDriver para JavaScript
import { Builder, By, Key, until } from 'selenium-webdriver';

// Função async para poder usar comandos await
async function cadastrarConsole() {
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
    await driver.sleep(2000);
	await driver.findElement(By.linkText("+Novo Registro")).click()
    await driver.sleep(1000);
    await driver.findElement(By.id("inputModel")).sendKeys("Nintendo DS")
    await driver.sleep(1000);
	await driver.findElement(By.id("inputProducer")).sendKeys("Nintendo")
    await driver.sleep(1000);
    let dataElement = await driver.findElement(By.css('input[type="date"]'))
    await dataElement.sendKeys('2004-11-21')
    await driver.sleep(1000);
	await driver.findElement(By.css(".btn-outline-danger")).click()
    await driver.sleep(1000);
	await driver.findElement(By.id("inputQuantity")).sendKeys("3")
    await driver.sleep(1000);
	await driver.findElement(By.id("inputPrice")).sendKeys("799.99")
    await driver.sleep(1000);
	{
		const element = await driver.findElement(By.id("inputCompanyMG"))
		if (!(await element.isSelected())) await element.click()
	}
    await driver.sleep(1000);
    let botaoSubmit = await driver.findElement(By.css(".text-end > .btn"))
    await driver.executeScript("arguments[0].scrollIntoView(true)", botaoSubmit)
    await driver.sleep(500);
    await botaoSubmit.click()
    await driver.sleep(3000);

    // Feche o navegador
    await driver.quit();
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
}

// Chame a função para fazer o cadastro usando o Selenium
cadastrarConsole();