import axios from "axios";
import sha1 from "crypto-js/sha1";
import { head, isString, replace, split } from "lodash";

export enum anonServiceStatus {
  enabled,
  disabled,
  unknown,
}

class AnonymizationService {
  private route?: string;
  private route2?: string;
  private status: anonServiceStatus;

  constructor() {
    const anonIdService = process.env.ANONYMOUS_ID_SERVICE;
    const infoSessionID = process.env.INFO_SESSION_ID_RESULT;

    if (anonIdService && infoSessionID) {
      // For the first try we are not sure if the service is available
      this.status = anonServiceStatus.unknown;
      this.route = anonIdService;
      this.route2 = infoSessionID;
    } else {
      // If the anonymization service is not defined, it's not available;
      this.status = anonServiceStatus.disabled;
    }
  }

  async getAnonymousIdOrGetItBack(id: string) {
    if (this.route && this.status !== anonServiceStatus.disabled) {
      const processedId = replace(
        head(split(id.trim(), "-")) || "",
        /\s|\.|^0+/g,
        ""
      );

      if (processedId) {
        try {
          const {
            data: { getAnonymousIdResult },
          } = await axios.post<{ getAnonymousIdResult: string }>(
            this.route,
            {
              Clave: sha1(processedId).toString(),
            },
            {
              // If the status is unknown, we will wait 1 second before timing out
              // If the status is enabled, we will wait 10 seconds before timing out
              timeout: this.status === anonServiceStatus.unknown ? 1000 : 10000,
            }
          );
          // If we got an successful response from the anonymization service, the anonymization service is available
          this.status = anonServiceStatus.enabled;

          if (isString(getAnonymousIdResult) && getAnonymousIdResult !== "") {
            // If the response from the anonymization service is valid, return it as the new id
            return getAnonymousIdResult;
          }
        } catch (err) {
          if (!err?.message?.match(/timeout|timedout/gi)) {
            // If anonymization service didn't timed out
            console.error("Anonymization service error!", err);
          }
          this.status = anonServiceStatus.unknown;
        }
      }
    }

    return id;
  }
  async getInfoSessionIdResult(id: string) {
    if (this.route2 && this.status !== anonServiceStatus.disabled) {
      try {
        const {
          data: { getInfoSessionIdResult },
        } = await axios.post<{ getInfoSessionIdResult: string }>(
          this.route2,
          {
            id,
          },
          //{
          //  Clave: sha1(id).toString(),   // uncomment or delete test1.1
          //},
          {
            // If the status is unknown, we will wait 1 second before timing out
            // If the status is enabled, we will wait 10 seconds before timing out
            timeout: this.status === anonServiceStatus.unknown ? 1000 : 10000,
          }
        );
        // If we got an successful response from the anonymization service, the anonymization service is available
        this.status = anonServiceStatus.enabled;

        if (getInfoSessionIdResult) {
          // If the response from the anonymization service is valid, return it as the new id
          return getInfoSessionIdResult;
        }
      } catch (err) {
        if (!err?.message?.match(/timeout|timedout/gi)) {
          // If anonymization service didn't timed out
          console.error("Anonymization service error!", err);
        }
        this.status = anonServiceStatus.unknown;
      }
    }

    return id;
  }
}

export const anonService = new AnonymizationService();
