import { signAccessJWT, signRefreshJWT } from "utils/handleJWT"

const testId = 1050

test("signAccessJWT creates new token", () => {
    const accessToken = signAccessJWT(testId)

    expect(accessToken).not.toBeFalsy()
    expect(typeof accessToken).toBe("string")
})

test("signRefreshJWT creates new token", () => {
    const accessToken = signRefreshJWT(testId)

    expect(accessToken).not.toBeFalsy()
    expect(typeof accessToken).toBe("string")
})