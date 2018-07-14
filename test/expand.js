'use strict'

const chai = require('chai')
const expect = chai.expect

const expand = require('../index.js')

describe('expand', () => {
  it('should replace variable with its value', function () {
    process.env['VARIABLE'] = 'value'
    expect(expand('${VARIABLE}')).to.equal('value')
  })
  it('should replace multiple variables their values', function () {
    process.env['VARIABLE1'] = 'value1'
    process.env['VARIABLE2'] = 'value2'
    expect(expand('${VARIABLE1} and ${VARIABLE2}')).to.equal('value1 and value2')
  })
  it('should work on objects recursively', function () {
    process.env['VARIABLE'] = 'value'
    expect(expand({property: '${VARIABLE}'})).to.deep.equal({property: 'value'})
  })
  it('should work on arrays', function () {
    process.env['VARIABLE'] = 'value'
    expect(expand(['${VARIABLE}'])).to.deep.equal(['value'])
  })
  it('should return null as is', function () {
    expect(expand(null)).to.equal(null)
  })
  it('should return undefined as is', function () {
    expect(expand(undefined)).to.equal(undefined)
  })
  it('should return booleans and numbers as is', function () {
    expect(expand(true)).to.equal(true)
    expect(expand(false)).to.equal(false)
    expect(expand(1)).to.equal(1)
    expect(expand(0.1)).to.equal(0.1)
    expect(expand(NaN)).to.be.NaN
  })
  it('should work with a custom substitution function', function () {
    process.env['VARIABLE'] = 'value'
    const result = expand('${VARIABLE}', {
      substitute: (variable, value) => variable + value
    })
    expect(result).to.equal('VARIABLEvalue')
  })
  it('should work with a variable specific substitution function', function () {
    process.env['VARIABLE1'] = 'value1'
    process.env['VARIABLE2'] = 'value2'
    const result = expand('${VARIABLE1} and ${VARIABLE2}', {
      substitute: {
        VARIABLE1: (value) => 'substituted' + value
      }
    })
    expect(result).to.equal('substitutedvalue1 and value2')
  })
  it('should throw errors from substitution as is', function () {
    class CustomError extends Error {}
    process.env['VARIABLE'] = 'value'
    expect(() => expand('${VARIABLE}', {
      substitute: (variable, value) => { throw new CustomError() }
    })).to.throw(CustomError)
  })
})
