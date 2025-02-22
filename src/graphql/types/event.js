export const typeDefs = `#graphql
  type Event {
    id: ID!
    flags: EventFlags
    promoterId: ID!
    name: String!
    venue: String!
    capacity: Int!
    location: Location
    eventDateTime: EventDateTime
    eventType: String!
    ticketTypes: [TicketType]
    bannerURL: String!
    images: [String]
    videos: [String]
    splitPercentage: Float!
    totalAmount: Float
    promoCode: String
    fights: [Fight]
    createdAt: String
    updatedAt: String
  }

  type EventFlags {
    isHeroBanner: FlagDetail
    isFeatured: FlagDetail
    isMainEvent: FlagDetail
    isFeaturedCombat: FlagDetail
  }

  type FlagDetail {
    value: Boolean
    priority: Int
  }

  type Location {
    street: String
    number: Int
    city: String
    postalCode: String
    country: String
    town: String
    county: String
  }

  type EventDateTime {
    date: String
    time: String
  }

  type TicketType {
    type: String
    price: Float
    capacity: Int
  }

  type Fight {
    teams: [Team]
  }

  type Team {
    teamName: String
    fighters: [Fighter]
  }

  type Fighter {
    fighterId: ID
  }

  input EventInput {
    flags: EventFlagsInput
    promoterId: ID!
    name: String!
    venue: String!
    capacity: Int!
    location: LocationInput
    eventDateTime: EventDateTimeInput
    eventType: String!
    ticketTypes: [TicketTypeInput]
    bannerURL: String!
    images: [String]
    videos: [String]
    splitPercentage: Float!
    promoCode: String
    fights: [FightInput]
  }

  input EventFlagsInput {
    isHeroBanner: FlagDetailInput
    isFeatured: FlagDetailInput
    isMainEvent: FlagDetailInput
    isFeaturedCombat: FlagDetailInput
  }

  input FlagDetailInput {
    value: Boolean
    priority: Int
  }

  input LocationInput {
    street: String
    number: Int
    city: String
    postalCode: String
    country: String
    town: String
    county: String
  }

  input EventDateTimeInput {
    date: String
    time: String
  }

  input TicketTypeInput {
    type: String
    price: Float
    capacity: Int
  }

  input FightInput {
    teams: [TeamInput]
  }

  input TeamInput {
    teamName: String
    fighters: [FighterInput]
  }

  input FighterInput {
    fighterId: ID
  }

  type Query {
    getEvents(first: Int, after: ID): EventConnection
    getEvent(id: ID!): Event
    getEventsByFlag(flag: String!, value: Boolean!, first: Int, after: ID): EventConnection 
  }

  type EventConnection {
    edges: [EventEdge]
    pageInfo: PageInfo
  }

  type EventEdge {
    cursor: ID
    node: Event
  }

  type PageInfo {
    hasNextPage: Boolean
    endCursor: ID
  }

  type Mutation {
    createEvent(input: EventInput!): Event
  }
`;
