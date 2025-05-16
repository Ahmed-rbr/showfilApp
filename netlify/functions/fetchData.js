export async function handler(event, context) {
  const endpoint = event.queryStringParameters.endpoint;
  const apiKey = process.env.TMDB_API_KEY;

  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch data from TMDb");
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
