export async function getRoute(
  source,
  destination,
  mode
) {

  const response = await fetch(
    `http://localhost:5000/api/route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        start: source,
        end: destination,
        mode: mode
      })
    }
  );

  const data = await response.json();

  return data;
}