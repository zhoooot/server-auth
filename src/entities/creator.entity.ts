import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Creator {
  @PrimaryKey({ type: 'uuid' })
  id: string;
  @Property({ type: 'text' })
  fullname: string;
  @Property({ type: 'text' })
  phone: string;
  @Property({ type: 'text' })
  institution: string;

  constructor(
    id?: string,
    fullname?: string,
    phone?: string,
    institution?: string,
  ) {
    this.id = id;
    this.fullname = fullname;
    this.phone = phone;
    this.institution = institution;
  }
}
