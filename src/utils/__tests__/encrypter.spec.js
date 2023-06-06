import bcrypt from "bcrypt";
import { Encrypter } from "../encrypter";
import { MissingParamError } from "../errors/missing-params-error";

jest.mock("bcrypt", () => ({
  isValid: true,
  async compare(value, hashed) {
    this.value = value;
    this.hashed_value = hashed;
    return this.isValid;
  },
}));

const makeSut = () => {
  return new Encrypter();
};

describe("Encrypter", () => {
  test("Should return true if bcrypty returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_value");
    expect(isValid).toBe(true);
  });

  test("Should return true if bcrypty returns true", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("password", "hashed_pass");
    expect(isValid).toBe(false);
  });

  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut();
    await sut.compare("any_value", "hashed_value");
    expect(bcrypt.value).toBe("any_value");
    expect(bcrypt.hashed_value).toBe("hashed_value");
  });

  test("Should throw if no params are provided", async () => {
    const sut = makeSut();
    expect(sut.compare()).rejects.toThrow(new MissingParamError("value"));
    expect(sut.compare("any_value")).rejects.toThrow(
      new MissingParamError("value")
    );
  });
});
