# Проект фронтовых автотестов

## Требуемое ПО
- Node js -> v.16 или выше (epilatov использует v18.16.0)
- VS Code
- Playwright Vs Code расширение (https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## Как использовать
- Клонировать репозиторий
- Открыть проект
- В терминале установить зависимости с помощью 'npm i'

## Опции (playwright.config.ts)
- Параллельный запуск включен

## Запуск автотестов через консоль
Прежде всего, имеется 4 файла с переменными : .env.dev, .env.local, .env.prod_chillbet, .env.prod_tivit 

При запуске через консоль на данный момент готово несколько конфигураций:
- "env:dev:admin" - запуск тестов админки на dev-стенде
- "env:dev:web" - запуск тестов веба на dev-стенде
- "env:prod_chillbet:web" - запуск тестов веба на prod-стенде chillbet.net
- "env:prod_tivit:web" - запуск всех тестов на prod-стенде tivitbet.app

Тестов для админки на проде нет, только web. 
Запуск происходит с помощью команды: npm run *env:dev:all* , где *env:dev:all* - наименование конфигурации. 

## Запуск автотестов через проект в Visual Studio
Для запуска автотестов в Playwright используется плагин Playwright Test for VSCode. По умолчанию будет использоваться .env.local - можно вводить любой свой url для админки и web-а.

Изменить запуск переменных по умолчанию можно в конфигурации playwright.config.ts:

dotenv.config({
  path: `helper/env/.env.local`,
  override: false
})
