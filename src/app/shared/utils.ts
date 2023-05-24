import {DatePipe} from "@angular/common";


export function formatDate(date: Date): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    return <string>datepipe.transform(date, 'dd-MMM-YYYY HH:mm:ss');
}

export function sortArrayByDateDesc(array: any[]): any[] {
    array.sort((a, b) => {
        let dateA: Date;
        let dateB: Date;
        if (a.createdDate) {
            dateA = new Date(a.createdDate);
            dateB = new Date(b.createdDate);
        } else if (a.lastModifiedDate) {
            dateA = new Date(a.lastModifiedDate);
            dateB = new Date(b.lastModifiedDate);
        } else {
            dateA = new Date(a.date);
            dateB = new Date(b.date);
        }

        return dateA.getTime() - dateB.getTime();
    });

    return array;
}
