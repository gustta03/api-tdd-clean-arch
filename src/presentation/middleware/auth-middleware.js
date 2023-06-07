import { HttpResponse } from "../helpers/httpReponse";

export class AuthMiddleware {
  constructor(loadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken;
  }

  async handle(request) {
    const { accessToken } = request;
    if (!accessToken) {
      throw HttpResponse.unauthorizeError()
    }
    const account = await this.loadAccountByToken.load(accessToken);
    if (account) {
      return HttpResponse.ok({ accountId: account.id });
    }
  }
}
