from playwright.sync_api import sync_playwright

def verify_usage_component():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Scroll to the Usage section (bottom of the page)
            # We look for "How to Use" heading
            usage_heading = page.get_by_role("heading", name="How to Use")
            usage_heading.scroll_into_view_if_needed()

            # Wait a bit for potential animations or loading
            page.wait_for_timeout(1000)

            # Take screenshot of the whole page, but focused on the bottom could be better.
            # However, taking full page screenshot is easiest to crop or just inspect.
            # Let's take a screenshot of the usage section specifically if possible,
            # or just the viewport after scrolling.

            page.screenshot(path="verification/usage_component.png")
            print("Screenshot taken at verification/usage_component.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_usage_component()
