const { test } = require('@playwright/test');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

test.describe('Accessibility smoke tests', () => {
    test('Sign in page should have no detectable accessibility violations', async ({ page }) => {
        await page.goto('http://localhost:8000/auth/signin.html');
        await injectAxe(page);
        await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true }
        });
    });

    test('Sign up page should have no detectable accessibility violations', async ({ page }) => {
        await page.goto('http://localhost:8000/auth/signup.html');
        await injectAxe(page);
        await checkA11y(page);
    });
});
