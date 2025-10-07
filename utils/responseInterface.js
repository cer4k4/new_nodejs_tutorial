
async function responseWriter(successfully,statusCode,data,message) {
    return {successfully:successfully,statusCode:statusCode,message,data}
}

module.exports = responseWriter