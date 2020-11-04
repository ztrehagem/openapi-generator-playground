import * as api from './index'
import * as runtime from 'runtime'
import { PetApi } from 'apis'

namespace middleware {
  export function abortable(signal: AbortSignal): runtime.Middleware {
    return {
      async pre({ url, init }) {
        init.signal = signal
        return { url, init }
      }
    }
  }
}

namespace getPetApi {
  export interface Request {
    id: number
  }

  class Api {
    abortController = new AbortController()
    api: PetApi

    constructor() {
    }

    getApiInstance() {
      const config = new runtime.Configuration({
        middleware: [
          middleware.abortable(this.abortController.signal)
        ]
      })
      return new PetApi(config)
    }

    async execute(req: Request) {
      const api = this.getApiInstance()
      const res = await api.getPetByIdRaw({ petId: req.id })
      res.raw.status
    }
  }
}

const controller = new AbortController()

const config = new runtime.Configuration({
  middleware: [
    middleware.abortable(controller.signal),
  ]
})

const petApi = new api.PetApi(config)

petApi
  .getPetById({ petId: 123 })
  .then((result) => {
    result.name
  })
