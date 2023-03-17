import { Track } from 'livekit-client';
import {
  getTrackReferenceSource,
  isTrackReference,
  TrackReferenceWithPlaceholder,
} from '../track-reference';
import {
  sortParticipantsByAudioLevel,
  sortParticipantsByIsSpeaking,
  sortParticipantsByJoinedAt,
  sortParticipantsByLastSpokenAT,
  sortTrackReferencesByScreenShare,
  sortTrackReferencesByType,
} from './base-sort-functions';

/**
 *
 *
 * Default sort for TrackParticipantPairs, it'll order participants by:
 * 1. local camera track (publication.isLocal)
 * 2. remote screen_share track
 * 3. local screen_share track
 * 4. remote dominant speaker camera track (sorted by speaker with the loudest audio level)
 * 5. other remote speakers that are recently active
 * 6. remote unmuted camera tracks
 * 7. remote unmuted microphone tracks
 * 8. remote tracks sorted by joinedAt
 */
export function sortTrackReferences(
  trackReferences: TrackReferenceWithPlaceholder[],
): TrackReferenceWithPlaceholder[] {
  const trackReferences_ = [...trackReferences];
  trackReferences_.sort((a, b) => {
    // Local camera TrackReference before remote.
    if (
      (a.participant.isLocal && getTrackReferenceSource(a) === Track.Source.Camera) ||
      (b.participant.isLocal && getTrackReferenceSource(b) === Track.Source.Camera)
    ) {
      if (a.participant.isLocal) {
        return -1;
      } else {
        return 1;
      }
    }

    // Screen share tracks before camera tracks
    if (
      (getTrackReferenceSource(a) === Track.Source.ScreenShare && getTrackReferenceSource(b)) ===
      Track.Source.ScreenShare
    ) {
      return sortTrackReferencesByScreenShare(a, b);
    }

    // Participant with higher audio level goes first.
    if (a.participant.isSpeaking && b.participant.isSpeaking) {
      return sortParticipantsByAudioLevel(a.participant, b.participant);
    }

    // A speaking participant goes before one that is not speaking.
    if (a.participant.isSpeaking !== b.participant.isSpeaking) {
      return sortParticipantsByIsSpeaking(a.participant, b.participant);
    }

    // A participant that spoke recently goes before a participant that spoke a while back.
    if (a.participant.lastSpokeAt !== b.participant.lastSpokeAt) {
      return sortParticipantsByLastSpokenAT(a.participant, b.participant);
    }

    if (isTrackReference(a) !== isTrackReference(b)) {
      return sortTrackReferencesByType(a, b);
    }

    // video on
    // const aVideo = a.videoTracks.size > 0;
    // const bVideo = b.videoTracks.size > 0;
    // if (aVideo !== bVideo) {
    //   if (aVideo) {
    //     return -1;
    //   } else {
    //     return 1;
    //   }
    // }

    // A participant that joined a long time ago goes before one that joined recently.
    return sortParticipantsByJoinedAt(a.participant, b.participant);
  });

  return trackReferences_;
}