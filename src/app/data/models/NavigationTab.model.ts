import {SubOptionModel} from "./SubOption.model";

export interface NavigationTabModel {
  index: number;
  label: string;
  icon: string;
  route?: string,
  subMenu?: SubOptionModel[];
}
