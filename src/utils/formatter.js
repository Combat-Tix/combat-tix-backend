export const formatLocation = async (location) => {
  const { street, number, town, city, county, postalCode, country } = location;
  const fullLocation = [`${street} ${number}`, town, city, county, postalCode, country]
    .filter(Boolean) // Remove any undefined or empty values
    .join(", ");

  return fullLocation;
};
