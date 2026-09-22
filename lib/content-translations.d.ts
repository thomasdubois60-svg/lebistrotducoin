export function translatableFields(source:unknown):Array<{path:string;source:string}>
export function localizeContent<T>(source:T,locale:string):T
export function translationFor(source:unknown,field:{path:string;source:string},locale:string):string
export function withReviewedTranslations<T>(source:T):T
