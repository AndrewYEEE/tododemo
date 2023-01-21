/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default class StringUtils {
  static keysToLowerCase(input: any): any {
    return Object.keys(input).reduce((destination, key) => {
      destination[key.toLowerCase()] = input[key];
      return destination;
    }, {});
  }
}
