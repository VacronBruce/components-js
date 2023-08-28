<!-- Do not edit this file. It is automatically generated by API Documenter. -->

## UseParticipantsOptions.updateOnlyOn property

To optimize performance, you can use the `updateOnlyOn` property to decide on what RoomEvents the hook updates. By default it updates on all relevant RoomEvents to keep the returned participants array up to date. The minimal set of non-overwriteable `RoomEvents` is: `[RoomEvent.ParticipantConnected, RoomEvent.ParticipantDisconnected, RoomEvent.ConnectionStateChanged]`

**Signature:**

```typescript
updateOnlyOn?: RoomEvent[];
```

{% partial file="p_usage.md" variables={exampleCount: 0} /%}