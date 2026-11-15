export async function loadLaptops() {
  try {
    const response = await fetch('data/laptops.json');
    if (!response.ok) {
      throw new Error('Laptop data could not be loaded.');
    }
    return await response.json();
  } catch (error) {
    throw new Error('We could not load the laptops. Check your connection and try again.');
  }
}
