type ClassValue = string | number | boolean | null | undefined | ClassList | ClassDict;

interface ClassList {
  [key: number]: ClassValue;
  length: number;
  toString(): string;
  join(separator?: string): string;
}

interface ClassDict {
  [key: string]: ClassValue;
}

function toVal(val: ClassValue): string {
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'number') {
    return String(val);
  }
  if (typeof val === 'boolean') {
    return val ? String(val) : '';
  }
  if (val == null) {
    return '';
  }
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return val.map(toVal).join(' ');
    }
    if (
      typeof val.toString === 'function' &&
      val.toString === Object.prototype.toString
    ) {
      const dict = val as ClassDict;
      return Object.keys(val).filter(k => dict[k]).join(' ');
    }
    return toVal(val as unknown as string);
  }
  return '';
}

function clsx(...args: ClassValue[]): string {
  return args.reduce<string>((result, val) => {
    return result + (val != null ? ' ' + toVal(val) : '');
  }, '');
}

export { clsx };