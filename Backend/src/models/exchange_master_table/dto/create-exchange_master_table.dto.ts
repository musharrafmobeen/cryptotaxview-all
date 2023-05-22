export class CreateExchangeMasterTableDto {
  name: string;
  csvRowToColTransformationRequired: Boolean;
  csvSplitIdentifiers: JSON;
  csvColumnMapping: JSON;
  csvColumnJoinMapping: JSON;
  csvFormulas: JSON;
}
