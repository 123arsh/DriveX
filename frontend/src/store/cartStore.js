import create from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (vehicle) => set((state) => ({ items: [...state.items, vehicle] })),
  removeItem: (vehicleId) => set((state) => ({ items: state.items.filter((item) => item._id !== vehicleId) })),
  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
