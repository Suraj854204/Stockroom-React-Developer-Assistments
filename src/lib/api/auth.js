import api from "@/lib/axios";

// POST /auth/login — DummyJSON returns the user profile plus a token
// when the credentials are correct, or a 400/401 with a message when
// they are not.
export async function login(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}
