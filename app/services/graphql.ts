import axios, { AxiosError } from './axios'

export default async (url: string, payload: any, authToken: string) => {
  const response = await axios({
    url: url,
    method: 'post',
    headers: { Authorization: `token ${authToken}` },
    data: payload
  })

  if (response.data.errors) {
    console.error(response.data.errors)
    const message = response.data.errors.map((error) => error.message).join('; ')
    throw new AxiosError(message)
  }

  return response.data.data
}
