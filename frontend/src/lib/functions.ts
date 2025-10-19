import { loadComplete } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants.ts'
import { store } from '@/store'

/**
 * Complete the loading process
 */
export const completed = (): void => {
  setTimeout(() => {
    store.dispatch(loadComplete())
  }, CONSTANT.LOADING_DURATION)
}
