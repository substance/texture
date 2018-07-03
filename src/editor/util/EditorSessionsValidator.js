export default class EditorSessionsValidator {
    areSessionsValid(sessions) {
        let result = {
            ok: true,
            errors: []
        }

        return new Promise(function(resolve, reject) {
            if (!sessions["manifest"]) {
                result.ok = false
                result.errors.push("There must be a manifest session.")
                resolve(result)
            }

            resolve(result)
        })
    }
}