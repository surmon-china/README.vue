import axios from 'axios'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorJSON = error.toJSON()
    const errorInfo = {
      code: errorJSON.status || error.response?.status,
      message: errorJSON.message || error.response?.data?.error || error.response?.statusText
    }

    console.debug('Fetch failed:', errorJSON)
    return Promise.reject(errorInfo)
  }
)

export * from 'axios'
export default axios
