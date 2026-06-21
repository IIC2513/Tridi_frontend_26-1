import { test, expect } from '@playwright/test'
const ROUTES = {
register: '/register',
login: '/login',
catalog: '/catalogue',
purchases: '/my-purchases',
}

function newUser() {
const id = Date.now()
return { email: `playwright_${id}@gmail.com`, username: `pw_${id}`, password: 'Test1234!' }
}

async function closeToast(page) {
await page.getByRole('button', { name: 'Dismiss' }).first().click({ timeout: 2000 }).catch(() => {})
}

async function register(page, user) {
await page.goto(ROUTES.register)
await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
await page.getByRole('textbox', { name: 'Username' }).fill(user.username)
await page.getByRole('textbox', { name: 'Password' }).fill(user.password)
await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click()
await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 12000 })
await closeToast(page)
}

test('registro: un usuario nuevo puede crear cuenta', async ({ page }) => {
const user = newUser()
await register(page, user)
await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
})
test('inicio de sesión: un usuario registrado puede entrar', async ({ page }) => {
const user = newUser()
await register(page, user)
await page.getByRole('button', { name: 'Logout' }).click()
await page.goto(ROUTES.login)
await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
await page.getByRole('textbox', { name: 'Password' }).fill(user.password)
await page.getByRole('button', { name: 'LOGIN', exact: true }).click()
await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 12000 })
})

test('compra: un usuario puede comprar un modelo', async ({ page }) => {
test.setTimeout(120000)
const user = newUser()
await register(page, user)
await page.goto(ROUTES.catalog)
await page.getByRole('button', { name: 'View Details' }).first().click()
await page.getByRole('button', { name: 'Add to cart' }).click()
await expect(page.getByText(/added successfully|added to cart/i).first()).toBeVisible({ timeout: 24000 })
await closeToast(page)
await page.getByRole('button', { name: 'Cart' }).click()
await page.getByRole('button', { name: 'Confirm Purchase' }).dispatchEvent('click')
await page.getByRole('textbox', { name: '0000 0000 0000' }).fill('1111 1111 1111 1111 1111')
await page.getByRole('textbox', { name: '08/30' }).fill('08/30')
await page.getByRole('spinbutton').fill('111')
await page.getByRole('button', { name: 'Add Card' }).click()
const card = page.locator('.cardTridi').filter({ hasText: '1111' }).first()
await expect(card).toBeVisible({ timeout: 12000 })
await card.dispatchEvent('click')
await expect(page).toHaveURL(/my-purchases/, { timeout: 15000 })
const purchase = page.getByText(/Purchase #\d+/i).first()
await expect(purchase).toBeVisible({ timeout: 10000 })
await purchase.click()
await page.getByRole('button', { name: 'Confirm Payment' }).click()
await expect(page.getByText(/purchase completed|paid successfully/i).first()).toBeVisible({ timeout: 15000 })
})