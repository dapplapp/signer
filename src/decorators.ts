import Signer from './Signer';
import { ERRORS, SignerError } from './SignerError';

export const ensureProvider = (
    target: Signer,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const origin = descriptor.value;

    descriptor.value = function(this: Signer, ...args: Array<any>): any {
        const provider = this.provider;

        if (!provider) {
            const error = this._handleError(
                ERRORS.ENSURE_PROVIDER,
                propertyKey
            );

            throw error;
        }

        return origin.apply(this, args);
    };
};

export const ensureProviderAsync = (
    target: Signer,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const origin = descriptor.value;

    descriptor.value = async function(
        this: Signer,
        ...args: Array<any>
    ): Promise<any> {
        const provider = this.provider;

        if (!provider) {
            const error = this._handleError(
                ERRORS.ENSURE_PROVIDER,
                propertyKey
            );

            throw error;
        }

        return await origin.apply(this, args);
    };
};

export const handleProviderInternalErrors = (
    target: Signer,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const origin = descriptor.value;

    descriptor.value = async function(
        this: Signer,
        ...args: Array<any>
    ): Promise<any> {
        try {
            return await origin.apply(this, args);
        } catch (err) {
            if (err instanceof SignerError) {
                throw err;
            }

            const error = this._handleError(
                ERRORS.PROVIDER_INTERNAL,
                err.message
            );

            throw error;
        }
    };
};

export const ensureAuthAsync = (
    target: Signer,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const origin = descriptor.value;

    descriptor.value = async function(
        this: Signer,
        ...args: Array<any>
    ): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (this._user == null) {
            const error = this._handleError(ERRORS.NOT_AUTHORIZED, propertyKey);

            throw error;
        }

        return await origin.apply(this, args);
    };
};