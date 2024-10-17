import { describe, expect, it } from "bun:test";
import { requestPathMatchesRouteDefinition } from ".";

describe("requestPathMatchesRouteDefinition with double wildcards", () => {
  it("undefined on double wildcard should result in true", () => {
    expect(requestPathMatchesRouteDefinition(
      undefined,
      ["**"]

    )).toBe(true)
  })

  it('2 parts on 1 part should result in false', () => {
    expect(requestPathMatchesRouteDefinition(
      ["test", "hello"],
      ["**"]
    )).toEqual(["test", "hello"])
  })

  it('2 parts on 1 parts with double wildcard should result in true with ["hello"]', () => {
    expect(requestPathMatchesRouteDefinition(
      ["test", "hello"],
      ["test", "**"]
    )).toEqual(["hello"])
  })

  it("1 part on double wildcard should result in [part1]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1"],
      ["**"]
    )).toEqual(["part1"])
  })

  it("2 parts on double wildcard should result in [part1, part2]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2"],
      ["**"]
    )).toEqual(["part1", "part2"])
  })

  it("3 parts on double wildcard should result in [part1, part2, part3]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2", "part3"],
      ["**"]
    )).toEqual(["part1", "part2", "part3"])
  })

  it("4 parts on double wildcard should result in [part1, part2, part3, part4]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2", "part3", "part4"],
      ["**"]
    )).toEqual(["part1", "part2", "part3", "part4"])
  })

  it("double wildcard at the end of multiple parts should result in [part2, part3, part4]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2", "part3", "part4"],
      ["part1", "**"]
    )).toEqual(["part2", "part3", "part4"])
  })

  it("double wildcard with an empty path should result in an empty array", () => {
    expect(() => requestPathMatchesRouteDefinition(
      [] as any, ["**"]

    )).toThrowError()
  })

  it("multiple parts with a single wildcard before double wildcard should result in [part2, part3, part4]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2", "part3", "part4"],
      ["part1", "*", "**"]
    )).toEqual(["part2", "part3", "part4"])
  })

  it("only double wildcard with empty path should result in []", () => {
    expect(() => requestPathMatchesRouteDefinition(
      [] as any, ["**"]

    )).toThrowError()
  })

  it("double wildcard with parts that should be excluded should result in [part3, part4]", () => {
    expect(requestPathMatchesRouteDefinition(
      ["part1", "part2", "part3", "part4"],
      ["part1", "part2", "**"]
    )).toEqual(["part3", "part4"])
  })
})
