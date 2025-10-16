// IndexedDB utility for CabStats
const DB_NAME = 'CabStatsDB';
const DB_VERSION = 2;

const STORES = {
    ACCOUNTS: 'accounts',
    BUSINESS_DAYS: 'businessDays',
    RIDES: 'rides',
    FUEL_TRANSFERS: 'fuelTransfers',
    EXPENSES: 'expenses',
    ACTIVE_RIDE: 'activeRide'
};

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create accounts store
                if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
                    const accountsStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id', autoIncrement: true });
                    accountsStore.createIndex('name', 'name', { unique: true });
                }

                // Create business days store
                if (!db.objectStoreNames.contains(STORES.BUSINESS_DAYS)) {
                    const businessDaysStore = db.createObjectStore(STORES.BUSINESS_DAYS, { keyPath: 'id', autoIncrement: true });
                    businessDaysStore.createIndex('status', 'status');
                    businessDaysStore.createIndex('createdAt', 'createdAt');
                }

                // Create rides store
                if (!db.objectStoreNames.contains(STORES.RIDES)) {
                    const ridesStore = db.createObjectStore(STORES.RIDES, { keyPath: 'id', autoIncrement: true });
                    ridesStore.createIndex('businessDayId', 'businessDayId');
                    ridesStore.createIndex('createdAt', 'createdAt');
                }

                // Create fuel transfers store
                if (!db.objectStoreNames.contains(STORES.FUEL_TRANSFERS)) {
                    const fuelTransfersStore = db.createObjectStore(STORES.FUEL_TRANSFERS, { keyPath: 'id', autoIncrement: true });
                    fuelTransfersStore.createIndex('status', 'status');
                    fuelTransfersStore.createIndex('createdAt', 'createdAt');
                }

                // Create expenses store
                if (!db.objectStoreNames.contains(STORES.EXPENSES)) {
                    const expensesStore = db.createObjectStore(STORES.EXPENSES, { keyPath: 'id', autoIncrement: true });
                    expensesStore.createIndex('businessDayId', 'businessDayId');
                    expensesStore.createIndex('category', 'category');
                    expensesStore.createIndex('createdAt', 'createdAt');
                }

                // Create active ride store (single record)
                if (!db.objectStoreNames.contains(STORES.ACTIVE_RIDE)) {
                    db.createObjectStore(STORES.ACTIVE_RIDE, { keyPath: 'id' });
                }
            };
        });
    }

    async add(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getById(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Special methods for active ride (single record)
    async saveActiveRide(rideData) {
        const transaction = this.db.transaction([STORES.ACTIVE_RIDE], 'readwrite');
        const store = transaction.objectStore(STORES.ACTIVE_RIDE);
        return new Promise((resolve, reject) => {
            const request = store.put({ id: 'active', ...rideData });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getActiveRide() {
        const transaction = this.db.transaction([STORES.ACTIVE_RIDE], 'readonly');
        const store = transaction.objectStore(STORES.ACTIVE_RIDE);
        return new Promise((resolve, reject) => {
            const request = store.get('active');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearActiveRide() {
        const transaction = this.db.transaction([STORES.ACTIVE_RIDE], 'readwrite');
        const store = transaction.objectStore(STORES.ACTIVE_RIDE);
        return new Promise((resolve, reject) => {
            const request = store.delete('active');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize default accounts
export const initializeDefaultAccounts = async (db) => {
    const accounts = await db.getAll(STORES.ACCOUNTS);

    if (accounts.length === 0) {
        const defaultAccounts = [
            { name: 'Main Account', balance: 0, updatedAt: new Date().toISOString() },
            { name: 'Fuel Account', balance: 0, updatedAt: new Date().toISOString() },
            { name: 'Cash Account', balance: 0, updatedAt: new Date().toISOString() },
            { name: 'Platform Account', balance: 0, updatedAt: new Date().toISOString() }
        ];

        for (const account of defaultAccounts) {
            await db.add(STORES.ACCOUNTS, account);
        }
    }
};

export const database = new Database();
export { STORES };
