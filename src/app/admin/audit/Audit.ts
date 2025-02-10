// list of types of actions recorded in audit log
export enum AuditActionType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

// audit information
export class Audit {
  actionType: AuditActionType;
  dateTime: Date;
  time: string;
  user: string;
  affectedUser: string;

  constructor(
    actionType: AuditActionType,
    dateTime: Date,
    user: string,
    affectedUser: string
  ) {
    this.actionType = actionType;
    this.dateTime = date;
    this.user = user;
    this.afftectedUser = userActionTakenAgainst;
  }
}
