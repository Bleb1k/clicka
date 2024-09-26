import { Enum } from "./helpers"

export const LOG_LEVELS = Enum("DEBUG", "INFO", "WARN", "ERROR")

export const LOG_LEVEL = "DEBUG"

/**
 *
 * @param {Object} param0
 * @param {any} param0.value
 * @param {keyof LOG_LEVELS} param0.logLevel
 * @returns
 */
export function defaultValue({ value, logLevel }) {
	return LOG_LEVEL === logLevel ? value : undefined
}
