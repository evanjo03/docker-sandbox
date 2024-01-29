import { Item } from "./types";

export async function getHealth() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/healthcheck`);
  return await response.json();
}

export async function createItem(item: Item): Promise<Item> {
  const { description, status } = item;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, status }),
    });

    if (!response.ok) {
      throw new Error("Failed to create item");
    }

    const newItem: Item = await response.json();
    return newItem;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to get all items
export async function getItems(): Promise<Item[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`);

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    const items: Item[] = await response.json();
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteItem(id: string): Promise<Item[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    const items: Item[] = await response.json();
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
