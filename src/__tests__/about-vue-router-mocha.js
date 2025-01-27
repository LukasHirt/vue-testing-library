import '@testing-library/jest-dom'
import {render} from '@testing-library/vue'
import semver from 'semver'

import About from './components/Router/About.vue'

const routes = []
test('uses require("vue-router").default when require("vue-router") is undefined (useful for mocha users)', () => {
  // Test for fix https://github.com/testing-library/vue-testing-library/issues/119
  jest.mock('vue-router', () => {
    return undefined
  })

  expect(() => render(About, {routes})).toThrowError(
    new TypeError(
      semver.gte(process.version, '16.0.0')
        ? "Cannot read properties of undefined (reading 'default')"
        : "Cannot read property 'default' of undefined",
    ),
  )
})
