import _axios from 'axios'

_axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Fetch failed:', error.toJSON())
    return Promise.reject(error)
  }
)

export const axios = _axios
export const graphql = async (url: string, payload: any, authToken: string) => {
  const response = await _axios({
    url: url,
    method: 'post',
    headers: { Authorization: `token ${authToken}` },
    data: payload
  })

  if (response.data.errors) {
    console.error(response.data.errors)
    const message = response.data.errors.map((e) => e.message).join('; ')
    throw Error(message)
  }

  return response.data.data
}
