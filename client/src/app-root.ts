import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  Item,
  createItem,
  deleteItem,
  getHealth,
  getItems,
} from "./services/api";

@customElement("app-root")
export class AppRoot extends LitElement {
  @property() loading = false;
  @property() isConnectedToApi = false;
  @property() items: Item[] = [];
  @property() item: Item = {
    description: "",
    status: "",
  };

  constructor() {
    super();

    this.getServerHealth();
  }

  get serverStatus() {
    if (this.loading) return "Loading...";

    return this.isConnectedToApi ? "Connected" : "Disconnected";
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("isConnectedToApi") && this.isConnectedToApi) {
      this.fetchItems();
    }
    super.willUpdate(changedProperties);
  }

  async fetchItems() {
    try {
      this.items = await getItems();
    } catch (error) {
      console.error(error);
    }
  }

  async getServerHealth() {
    this.loading = true;
    try {
      const result = await getHealth();
      if (result.status === "ok") {
        this.isConnectedToApi = true;
      }
    } catch (error) {
      this.isConnectedToApi = false;
    } finally {
      this.loading = false;
    }
  }

  onDescriptionChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.item = {
      ...this.item,
      description: value,
    };
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.item = {
      ...this.item,
      status: value,
    };
  }

  async onItemDeleteClick(id: string) {
    try {
      await deleteItem(id);
      await this.fetchItems();
    } catch (error) {
      console.error(error);
    }
  }

  async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    try {
      await createItem(this.item);
      await this.fetchItems();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return html`
      <div>
        <h3>Server Status: ${this.serverStatus}</h3>
        <div class="content-wrapper">
          <div>
            <h3>Add Item</h3>
            <form @submit=${this.onSubmit}>
              <div>
                <label for="status">Status:</label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  .value=${this.item?.status || ""}
                  @change=${this.onStatusChange}
                  required
                />
              </div>

              <div>
                <label for="description">Description:</label>
                <input
                  type="text"
                  id="description"
                  .value=${this.item?.description || ""}
                  @change=${this.onDescriptionChange}
                  name="description"
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <h3>Items</h3>
            ${this.items.length === 0
              ? html`<p>No items found.</p>`
              : html` <div class="item">
                  <div
                    style="display: flex; flex-direction: row; align-items: flex-start"
                  >
                    <div style="width: 200px"><strong>Description</strong></div>
                    <div style="width: 200px"><strong>Status</strong></div>
                  </div>
                  <div><strong>Action</strong></div>
                </div>`}
            ${this.items.map((item) => {
              return html`
                <div class="item">
                  <div style="display: flex; flex-direction: row; ">
                    <div style="width: 200px">${item.description}</div>
                    <div style="width: 200px">${item.status}</div>
                  </div>
                  <button
                    @click=${() => this.onItemDeleteClick(item.id as string)}
                  >
                    X
                  </button>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .item {
      display: flex;
      margin: 1rem;
      align-items: center;
      justify-content: space-between;
    }

    .content-wrapper {
      display: flex;
      gap: 2rem;
      flex-direction: column;
    }

    form {
      justify-content: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    form > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    form input {
      width: 95%;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-root": AppRoot;
  }
}
