export function toFormData(object: any): FormData {
    const formdata = new FormData();
    for (const prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        formdata.append(prop, object[prop]);
    }
    return formdata;
}

export function validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) && mail.length > 5) {
        return true;
    }

    return false;
}
export function fileListToFormData(files: Array<File>): FormData {
    const formData = new FormData();
    files.forEach(element => {
        formData.append("files", element)
    });
    return formData;
}
export function toHttpParamString(object: any): string {
    let stringToReturn = '';
    for (const prop in object) {
        // console.log(object[prop]);
        // skip loop if the property is from prototype
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        stringToReturn = '&' + prop + '=' + object[prop] + stringToReturn;
    }
    return stringToReturn;
}
export function markAsTouched(formGroup: any): void {
    formGroup.markAsTouched();
    formGroup.updateValueAndValidity();
    (<any>Object).values(formGroup.controls).forEach(
        (control: any) => {
            control.markAsTouched();
            control.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            if (control.controls) {
                markAsTouched(control);
            }
        });
}

export function checkPermissions(permissionsNeeded: string[] | string, userPermissions: string[]): boolean {
  if (!permissionsNeeded || permissionsNeeded.length === 0) {
    return false;
  }

  const permissionsArray = Array.isArray(permissionsNeeded) ? permissionsNeeded : permissionsNeeded.split(',');

  return permissionsArray.some(el => userPermissions.includes(el));
}
