import { expect, test } from "@playwright/test";

async function gotoBoard(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByTestId("board")).toHaveAttribute(
    "data-dnd-ready",
    "true",
  );
}

test.describe("Kanban board", () => {
  test("loads dummy data on open", async ({ page }) => {
    await gotoBoard(page);
    await expect(page.getByTestId("board")).toBeVisible();
    await expect(page.getByTestId("column-col-backlog")).toBeVisible();
    await expect(page.getByTestId("column-col-ready")).toBeVisible();
    await expect(page.getByTestId("column-col-progress")).toBeVisible();
    await expect(page.getByTestId("column-col-review")).toBeVisible();
    await expect(page.getByTestId("column-col-done")).toBeVisible();
    await expect(page.getByTestId("card-card-1")).toContainText(
      "Map onboarding flow",
    );
    await expect(page.getByTestId("card-count")).toHaveText("9 cards");
  });

  test("renames a column", async ({ page }) => {
    await gotoBoard(page);
    await page.getByTestId("rename-column-col-backlog").click();
    const input = page.getByTestId("rename-column-input-col-backlog");
    await input.fill("Ideas");
    await input.press("Enter");
    await expect(page.getByTestId("rename-column-col-backlog")).toHaveText(
      "Ideas",
    );
  });

  test("adds a card to a column", async ({ page }) => {
    await gotoBoard(page);
    await page.getByTestId("add-card-trigger-col-review").click();
    const form = page.getByTestId("add-card-form-col-review");
    await form.getByLabel("Card title").fill("QA checklist");
    await form.getByLabel("Card details").fill("Cover rename, add, delete, drag");
    await form.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText("QA checklist")).toBeVisible();
    await expect(page.getByTestId("card-count")).toHaveText("10 cards");
  });

  test("deletes a card", async ({ page }) => {
    await gotoBoard(page);
    await page.getByTestId("card-card-2").hover();
    await page.getByTestId("delete-card-card-2").click();
    await expect(page.getByTestId("card-card-2")).toHaveCount(0);
    await expect(page.getByTestId("card-count")).toHaveText("8 cards");
  });

  test("drags a card to another column", async ({ page }) => {
    await gotoBoard(page);
    const handle = page.getByTestId("drag-handle-card-1");
    const target = page.getByTestId("column-drop-col-ready");

    const handleBox = await handle.boundingBox();
    const targetBox = await target.boundingBox();
    if (!handleBox || !targetBox) {
      throw new Error("Missing bounding boxes for drag");
    }

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      handleBox.x + handleBox.width / 2 + 12,
      handleBox.y + handleBox.height / 2,
      { steps: 4 },
    );
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + 48,
      { steps: 20 },
    );
    await page.mouse.up();

    await expect(page.getByTestId("column-col-ready")).toContainText(
      "Map onboarding flow",
    );
    await expect(page.getByTestId("column-col-backlog")).not.toContainText(
      "Map onboarding flow",
    );
  });

  test("reorders a card within a column", async ({ page }) => {
    await gotoBoard(page);
    const handle = page.getByTestId("drag-handle-card-1");
    const target = page.getByTestId("drag-handle-card-2");

    const handleBox = await handle.boundingBox();
    const targetBox = await target.boundingBox();
    if (!handleBox || !targetBox) {
      throw new Error("Missing bounding boxes for reorder");
    }

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2 + 16,
      { steps: 4 },
    );
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height - 4,
      { steps: 16 },
    );
    await page.mouse.up();

    const backlog = page.getByTestId("column-col-backlog");
    const titles = backlog.locator("h3");
    await expect(titles.nth(0)).toHaveText("Collect brand assets");
    await expect(titles.nth(1)).toHaveText("Map onboarding flow");
  });
});
