*The types correspond to the value of the first byte of a packet (and therefore there can be 255 types with 000 reserved)*

### Packet types
> 000 . . . . . Reserved  
> 001 . . . . . Ping  
> 002 . . . . . Pong  (and 'Connection Accepted')  
> 003 . . . . . Connect  
> 004 . . . . . Disconnect  
> 005 . . . . . Packet received  
> 006 . . . . . Request resend  
> 007 . . . . . Chat  
> 008 . . . . . Part of big packet  
> 009 . . . . . TBD  
> . . . . . . . . . . . . .