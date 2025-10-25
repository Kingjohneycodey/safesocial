const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getPosts(token?: string) {
  const res = await fetch(`${API_URL}/api/posts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
