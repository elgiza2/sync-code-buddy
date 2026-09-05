import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import logoGoogle from "@/assets/logo-google.svg";
import logoAlibaba from "@/assets/logo-alibaba.svg";

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

const PrizeModal = () => {
  const { user, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [expired, setExpired] = useState(false);
  const [parts, setParts] = useState({ h: "00", m: "00", s: "00" });

  const reward = Number(user.rewardBalance ?? 0);
  const expires = user.rewardExpiresAt;

  const displayName =
    [user.telegramUser.first_name, user.telegramUser.last_name].filter(Boolean).join(" ").trim() ||
    user.telegramUser.username ||
    "Player";

  const sweep = useCallback(async () => {
    try {
      await (supabase as any).rpc("expire_prize_rewards");
      await refreshProfile();
    } catch {
      /* ignore */
    }
  }, [refreshProfile]);

  useEffect(() => {
    if (!user.profileId) return;
    void sweep();
  }, [user.profileId, sweep]);

  useEffect(() => {
    if (!reward || !expires) return;
    if (new Date(expires).getTime() <= Date.now()) return;
    setOpen(true);
  }, [reward, expires]);

  useEffect(() => {
    if (!expires) return;
    const tick = () => {
      const ms = new Date(expires).getTime() - Date.now();
      if (ms <= 0) {
        setParts({ h: "00", m: "00", s: "00" });
        if (!expired) {
          setExpired(true);
          setOpen(false);
          void sweep();
        }
        return;
      }
      setParts({
        h: pad(Math.floor(ms / 3600000)),
        m: pad(Math.floor((ms % 3600000) / 60000)),
        s: pad(Math.floor((ms % 60000) / 1000)),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [expires, expired, sweep]);

  if (!reward || !expires || expired) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] left-1/2 right-auto top-auto z-[1001] block max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[440px] -translate-x-1/2 translate-y-0 overflow-hidden rounded-[28px] border border-foreground/15 bg-background p-0 shadow-2xl sm:bottom-auto sm:top-1/2 sm:w-[calc(100%-2rem)] sm:max-w-[420px] sm:-translate-y-1/2 [&>button]:z-30 [&>button]:text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[min(680px,calc(100dvh-1rem))] w-full overflow-hidden bg-background text-center sm:min-h-[min(700px,calc(100dvh-2rem))]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4"
          />

          <div className="relative z-10 flex min-h-[min(680px,calc(100dvh-1rem))] flex-col justify-between px-5 pb-5 pt-16 sm:min-h-[min(700px,calc(100dvh-2rem))] sm:px-7 sm:pb-7">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-medium uppercase text-foreground/70"
              >
                A private reward for {displayName}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-instrument mt-3 text-[3.65rem] font-normal leading-[0.86] text-foreground sm:text-[4.25rem]"
              >
                ${reward.toLocaleString("en-US")}
                <span className="mt-2 block text-[2rem] italic leading-none sm:text-[2.35rem]">is now yours</span>
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 flex items-center justify-center gap-3 text-xs text-foreground/80"
              >
                <span>Presented with</span>
                <img src={logoGoogle} alt="Google" className="h-4 w-4" />
                <span className="h-3 w-px bg-foreground/30" aria-hidden="true" />
                <img src={logoAlibaba} alt="Alibaba" className="h-4 w-4" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-3 text-xs text-foreground/70">Claim before your private window closes</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: parts.h, l: "hours" },
                  { v: parts.m, l: "minutes" },
                  { v: parts.s, l: "seconds" },
                ].map((seg) => (
                  <div
                    key={seg.l}
                    className="border border-foreground/20 bg-background/45 px-2 py-3 backdrop-blur-md"
                  >
                    <p className="font-instrument text-3xl leading-none text-foreground tabular-nums">
                      {seg.v}
                    </p>
                    <p className="mt-1 text-[9px] uppercase text-foreground/60">{seg.l}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/wallet" });
                }}
                className="mt-4 h-12 w-full bg-foreground text-sm font-medium text-background hover:bg-foreground/90"
              >
                Claim in wallet
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)} className="mt-1 h-9 w-full text-xs text-foreground/70">
                Maybe later
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PrizeModal;
