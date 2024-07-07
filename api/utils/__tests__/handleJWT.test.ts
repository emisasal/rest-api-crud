import { signAccessJWT, signRefreshJWT } from "utils/handleJWT"

const testId = 1050

test.skip("signAccessJWT creates new token", () => {
    const accessToken = signAccessJWT(testId)

    expect(accessToken).not.toBeFalsy()
    expect(typeof accessToken).toBe("string")
})

test.skip("signRefreshJWT creates new token", () => {
    const accessToken = signRefreshJWT(testId)

    expect(accessToken).not.toBeFalsy()
    expect(typeof accessToken).toBe("string")
})