.PHONY: watch tmux tmux_setup
project=hushlittleone
instance=\033[36;01m${project}\033[m

all: watch

watch: 
	@stylus -w --use /usr/lib/node_modules/nib/lib/nib -o css css/styl

tmux_setup:
	@tmux new-session -s ${project} -d -n workspace
	@tmux split-window -t ${project} -h
	@tmux select-pane -t ${project}:1.0
	@tmux resize-pane -R 16
	@tmux send-keys -t ${project}:1.0 'vim' C-m
	@tmux send-keys -t ${project}:1.1 'vim' C-m
	@tmux select-pane -t ${project}:1.0
	
tmux:
	@if ! tmux has-session -t ${project}; then exec make tmux_setup; fi
	@tmux attach -t ${project}
