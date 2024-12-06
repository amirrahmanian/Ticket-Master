import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidTimestamp(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidTimestamp',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          return +Date.parse(new Date(value).toString()) > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid timestamp`;
        },
      },
    });
  };
}
