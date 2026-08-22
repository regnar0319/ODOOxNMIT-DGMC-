const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

test.describe('Accessibility smoke tests', () => {
    test('Sign in page should have no detectable accessibility violations', async ({ page }) => {
        await page.goto('http://localhost:8000/auth/signin.html');
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations.length, `Accessibility violations:\n${JSON.stringify(results.violations, null, 2)}`).toBe(0);
    });

    test('Sign up page should have no detectable accessibility violations', async ({ page }) => {
        await page.goto('http://localhost:8000/auth/signup.html');
        const results2 = await new AxeBuilder({ page }).analyze();
        expect(results2.violations.length, `Accessibility violations:\n${JSON.stringify(results2.violations, null, 2)}`).toBe(0);
    });
});
