'use client';

import {useEffect, useRef, useState} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";
import { Button } from "@/components/ui/button";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    // Session timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (callStatus === CallStatus.ACTIVE) {
            interval = setInterval(() => {
                setSessionDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callStatus]);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
            setError(null);
            setSessionDuration(0);
            setIsRecording(true);
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            setIsRecording(false);
            addToSessionHistory(companionId).catch(err => {
                console.error('Failed to save session history:', err);
                setError('Failed to save session history');
            });
        }

        const onMessage = (message: Message) => {
            try {
                if(message.type === 'transcript' && message.transcriptType === 'final') {
                    const newMessage = { role: message.role, content: message.transcript };
                    setMessages((prev) => [newMessage, ...prev]);
                }
            } catch (err) {
                console.error('Error processing message:', err);
                setError('Error processing voice message');
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => {
            console.error('Vapi error:', error);
            setError(`Voice session error: ${error.message}`);
            setCallStatus(CallStatus.INACTIVE);
            setIsRecording(false);
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        try {
            setCallStatus(CallStatus.CONNECTING);
            setError(null);

            // Check if Vapi is available
            if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
                throw new Error('Vapi token not configured. Please set up your Vapi API key.');
            }

            const assistantOverrides = {
                variableValues: { subject, topic, style },
                clientMessages: ["transcript"],
                serverMessages: [],
            }

            // @ts-expect-error - Vapi types need updating
            await vapi.start(configureAssistant(voice, style), assistantOverrides);
        } catch (err) {
            console.error('Failed to start voice session:', err);
            setError(err instanceof Error ? err.message : 'Failed to start voice session');
            setCallStatus(CallStatus.INACTIVE);
        }
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    // Format session duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="flex flex-col h-[70vh]">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-medium">Session Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Session Status */}
            {callStatus === CallStatus.ACTIVE && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Recording Session</span>
                    </div>
                    <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
                </div>
            )}

            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section">
                    <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <div
                            className={
                            cn(
                                'absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )
                        }>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
                        </div>

                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    <p className="font-bold text-2xl">{name}</p>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                        <p className="font-bold text-2xl">
                            {userName}
                        </p>
                    </div>
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
                        <p className="max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', callStatus ===CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse')} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                        {callStatus === CallStatus.ACTIVE
                        ? "End Session"
                        : callStatus === CallStatus.CONNECTING
                            ? 'Connecting'
                        : 'Start Session'
                        }
                    </button>
                </div>
            </section>

            <section className="transcript">
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace('/[.,]/g, ','')
                                    }: {message.content}
                                </p>
                            )
                        } else {
                           return <p key={index} className="text-primary max-sm:text-sm">
                                {userName}: {message.content}
                            </p>
                        }
                    })}
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent
